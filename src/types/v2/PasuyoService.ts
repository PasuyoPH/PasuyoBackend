import { V2JobTypes } from './db/Job'

enum PasuyoFormTypes {
  INPUT,
  SELECT_ADDRESS
}

interface PasuyoForm {
  placeholder?: string
  key: string

  icon?: string
  type?: PasuyoFormTypes

  label?: string
  numberOnly?: boolean
}

interface PasuyoFormStructure {
  content: PasuyoForm[]
  row?: boolean
}

interface PasuyoService {
  name: string
  icon: string

  unavailable?: boolean
  label: string

  form: PasuyoFormStructure[] | PasuyoFormStructure[][] // use 2d arrays if planning to use paging system
  usePages?: boolean

  displayLabel: string
  displaySubLabel?: string
  
  type?: V2JobTypes
}

const Services: PasuyoService[] = [
  {
    name: 'Delivery',
    icon: 'box-open',
    
    label: 'PADELIVER',

    form: [
      {
        content: [
          { placeholder: 'Item Name', key: 'item', icon: 'boxes' },
          {
            placeholder: 'Weight (KG)',
            key: 'weight',
            icon: 'balance-scale',
            numberOnly: true
          }
        ]
      },

      {
        content: [
          { key: 'fromAddress', label: 'From Address', type: PasuyoFormTypes.SELECT_ADDRESS },
          { key: 'toAddress', label: 'To Address', type: PasuyoFormTypes.SELECT_ADDRESS }
        ],
        row: true
      }
    ],

    unavailable: false,
    usePages: false,

    displayLabel: 'Pa Deliver',
    displaySubLabel: 'Pa deliver kana!',

    type: V2JobTypes.PADELIVER
  },

  {
    name: 'Bili',
    icon: 'hamburger',

    label: 'PABILI',
    unavailable: true,

    form: [],
    displayLabel: 'Pa Bili'
  },

  {
    name: 'Angkas',
    icon: 'motorcycle',

    label: 'PAANGKAS',
    unavailable: true,

    form: [],
    displayLabel: 'Pa Angkas'
  },

  {
    name: 'Deposit',
    icon: 'money-bill-wave',

    label: 'PADEPOSIT',
    unavailable: true,

    form: [],
    displayLabel: 'Pa Deposit'
  },

  {
    name: 'Utos',
    icon: 'shopping-cart',

    label: 'PAUTOS',
    unavailable: true,

    form: [],
    displayLabel: 'Pa Utos'
  }
]

export {
  PasuyoForm,
  PasuyoFormStructure,

  PasuyoFormTypes,
  PasuyoService,
  
  Services
}