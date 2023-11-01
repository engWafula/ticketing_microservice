import nats from "node-nats-streaming"
import { OrderCancelledEvent,Publisher,Subjects } from "@waticket/common"
console.clear()


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}