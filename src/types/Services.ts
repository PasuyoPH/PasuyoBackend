import { JobTypes } from './database/Job'

enum PickupPaymentTypes {
  DROPOFF,
  PICKUP
}

enum PasuyoFormTypes {
  INPUT,
  SELECT_ADDRESS,
  SELECT
}

interface SelectFormInput {
  value: string | number
  label: string
}

interface PasuyoForm {
  placeholder?: string
  key: string

  icon?: string
  type?: PasuyoFormTypes

  label?: string
  numberOnly?: boolean

  choices?: SelectFormInput[]
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
  
  type?: JobTypes
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
          { key: 'fromAddress', label: 'Pickup From', type: PasuyoFormTypes.SELECT_ADDRESS },
          { key: 'toAddress', label: 'Deliver To', type: PasuyoFormTypes.SELECT_ADDRESS }
        ],
        row: true
      },

      {
        content: [
          {
            key: 'cashPickup',
            label: 'Where to pickup payment',
            type: PasuyoFormTypes.SELECT,
            choices: [
              {
                label: 'Dropoff',
                value: PickupPaymentTypes.DROPOFF
              },
              {
                label: 'Pickup',
                value: PickupPaymentTypes.PICKUP
              }
            ]
          }
        ]
      }
    ],

    unavailable: false,
    usePages: false,

    displayLabel: 'Pa Deliver',
    displaySubLabel: 'Pa deliver kana!',

    type: JobTypes.DELIVERY
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
  
  Services,
  PickupPaymentTypes
}