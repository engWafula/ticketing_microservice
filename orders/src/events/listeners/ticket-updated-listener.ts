import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent, NotFoundError } from '@waticket/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
   const {title,price,id,version} = data

   const ticket = await Ticket.findByEvent(data)

   if(!ticket){
    return new NotFoundError()
   }

   ticket.set({
    title,
    price
   })

   await ticket.save()

   msg.ack()

  }
}