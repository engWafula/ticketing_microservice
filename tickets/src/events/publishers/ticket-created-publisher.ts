import nats from "node-nats-streaming"
import { TicketCreatedEvent,Publisher,Subjects } from "@waticket/common"
console.clear()


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}