import { Order } from '@src/contract.js'

export function convertOrderToSQLOrder(order: Order): string {
  switch (order) {
    case Order.Asc: return 'ASC'
    case Order.Desc: return 'DESC'
  }
}
