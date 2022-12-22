import restana from 'restana'
import { IConfig } from '../types/Config'

import Path from './Path'
import Utils from '../Utils'

import Models from '../schemas'
import { connect } from 'mongoose'

import moment from 'moment'
import CompaniesData from '../../companies.json'

import { createHash, randomBytes } from 'crypto'
import {
  readFile,
  writeFile
} from 'fs/promises'

class HttpServer {
  public restana = restana()
  public routes: Map<string, Path> = new Map()

  public PROCESS_CWD = process.cwd()
  public utils = new Utils(this)

  public models = Models
  public cache = {
    ttl: 5, // in minutes
    data: new Map<string, { expiry: number, data: Buffer } | undefined>() // cache url reponses instead
  }

  constructor(public config: IConfig) {}

  public async log(...content: any[]) {
    return new Promise(
      (resolve) => resolve(
        console.log(
          moment()
            .format('LLL'),
          '|',
          ...content
        )
      )
    )
  }

  public async setupCompanies() {
    const companies = CompaniesData.companies,
      str = JSON.stringify(companies),
      hash = createHash('md5')
        .update(str)
        .digest('hex'),
      cwd = process.cwd()

    await this.log('Current "companies.json" hash:', hash)
    let hashInFile: string

    // get hash if present and compare
    try {
      hashInFile = await readFile(cwd + '/hash', 'hex')
      await this.log('Found hash file:', hashInFile)
    } catch {
      await this.log('An error happened while reading the hash file.')
    }

    if (hash !== hashInFile) { // hash is different oh no!
      await this.log('Hash doesn\'t match. Will do an update.')

      await writeFile(
        cwd + '/hash',
        Buffer.from(hash, 'hex')
      )

      // update companies to db
      await this.models.Companies.deleteMany({})

      for (const company of companies) {
        const companyId = randomBytes(8) // generate uid for company
          .toString('hex'),
          companyData = {
            name: company.name,
            uid: companyId,
            meals: []
          }

        for (const meal of company.meals) {
          const mealId = randomBytes(8)
            .toString('hex')
            
          companyData.meals.push(
            {
              uid: mealId,
              ...meal
            }
          )
        }

        const model = new this.models.Companies(companyData)
        await model.save()
      }

      await this.log('Updated all companies and meals.')
    } else await this.log('Hash matched.')
  }

  public async ready() {
    if (this.config.db.uri)
      await connect(this.config.db.uri)
    else await connect(
      `mongodb://${this.config.db.host}:${this.config.db.port}`,
      {
        user: this.config.db.user,
        pass: this.config.db.pass,

        dbName: this.config.db.dbName,
        authSource: this.config.db.authSource
      }
    )

    // setup companies here
    await this.setupCompanies()

    return this.restana.start(this.config.http.port)
  }

  public async register(path: typeof Path) {
    const pathInstance  = new path()
    pathInstance.server = this

    this.routes.set(pathInstance.path, pathInstance)
    await pathInstance.register(this)

    await this.log(
      'Route:',
      pathInstance.path,
      'added with method:',
      pathInstance.method.toUpperCase()
    )
  }
}

export default HttpServer
