import { S3 } from '@aws-sdk/client-s3'

interface Storages {
  evidences: S3
  profiles: S3
  load: S3
}

export default Storages