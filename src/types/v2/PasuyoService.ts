interface PasuyoForm {
  placeholder: string
  key: string

  icon?: string
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

  form: PasuyoFormStructure[]
}

const Services: PasuyoService[] = [
  {
    name: 'Delivery',
    icon: 'deliver',
    
    label: 'PADELIVER',
    form: [
      {
        content: [
          { key: 'RowForm1', placeholder: 'Row Form 1' },
          { key: 'RowForm2', placeholder: 'Row Form 2' }
        ],
        row: true
      },

      {
        content: [
          { key: 'ColumnForm1', placeholder: 'Column Form 1' },
          { key: 'ColumnForm2', placeholder: 'Column Form 2' }
        ]
      }
    ],

    unavailable: false
  },

  {
    name: 'Bili',
    icon: 'bili',

    label: 'PABILI',
    unavailable: true,

    form: []
  },

  {
    name: 'Angkas',
    icon: 'angkas',

    label: 'PAANGKAS',
    unavailable: true,

    form: []
  },

  {
    name: 'Deposit',
    icon: 'deposit',

    label: 'PADEPOSIT',
    unavailable: true,

    form: []
  },

  {
    name: 'Utos',
    icon: 'utos',

    label: 'PAUTOS',
    unavailable: true,

    form: []
  }
]

export {
  PasuyoForm,
  PasuyoFormStructure,

  PasuyoService,
  Services
}