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
}

const Services: PasuyoService[] = [
  {
    name: 'Delivery',
    icon: 'deliver',
    
    label: 'PADELIVER',

    form: [
      {
        content: [
          { placeholder: 'Item Name', key: 'item', icon: 'boxes' }
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
    displaySubLabel: 'Pa deliver kana!'
  },

  {
    name: 'Bili',
    icon: 'bili',

    label: 'PABILI',
    unavailable: true,

    form: [],
    displayLabel: 'Pa Bili'
  },

  {
    name: 'Angkas',
    icon: 'angkas',

    label: 'PAANGKAS',
    unavailable: true,

    form: [],
    displayLabel: 'Pa Angkas'
  },

  {
    name: 'Deposit',
    icon: 'deposit',

    label: 'PADEPOSIT',
    unavailable: true,

    form: [],
    displayLabel: 'Pa Deposit'
  },

  {
    name: 'Utos',
    icon: 'utos',

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