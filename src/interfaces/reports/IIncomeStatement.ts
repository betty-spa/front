export type IIncomeStatementExpenseDetailType = "financial" | "operational" | "administrative"

export interface IIncomeStatementExpenseDetail {
    type: IIncomeStatementExpenseDetailType
    total: number
}

export interface IIncomeStatementMonth {
    month: number
    label: string
    year: number
    salesIncome: number
    purchaseOrdersIncome: number
    expenses: number
    expenseDetail: IIncomeStatementExpenseDetail[]
    net: number
}

export interface IIncomeStatementTotals {
    salesIncome: number
    purchaseOrdersIncome: number
    expenses: number
    net: number
}

export interface IIncomeStatement {
    year: number
    storeId?: string
    months: IIncomeStatementMonth[]
    totals: IIncomeStatementTotals
}
