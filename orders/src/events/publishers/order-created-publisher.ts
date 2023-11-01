import nats from "node-nats-streaming"
import { OrderCreatedEvent,Publisher,Subjects } from "@waticket/common"
console.clear()


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}