import nats from "node-nats-streaming"
import { TicketUpdatedEvent,Publisher,Subjects } from "@waticket/common"
console.clear()


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}