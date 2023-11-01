import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth,validateRequest } from '@waticket/common';
import {body} from "express-validator"
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import mongoose from 'mongoose';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 1*60
router.post('/api/orders',requireAuth,[
  body("ticketId")
  .not()
  .isEmpty()
  .custom((value)=>{
    return mongoose.Types.ObjectId.isValid(value)
  })
  .withMessage("ticketId must be provided"),
],validateRequest, async (req: Request, res: Response) => {

  const {ticketId} = req.body;

  const ticket = await Ticket.findById(ticketId);

  if(!ticket){
    throw  new NotFoundError()
  }


  //check to see if ticket has already been reserved
  const isReserved =  await ticket.isReserved()


  if(isReserved){
    throw new BadRequestError('Ticket is already reserved');
  }

  //set the expiration date

  const expiration = new Date()
  expiration.setSeconds(expiration.getSeconds()+ EXPIRATION_WINDOW_SECONDS)

  //BUILD ORDER AND SAVE TO DB 

  const order = Order.build({
       userId:req.currentUser.id,
       status:OrderStatus.Created,
       expiresAt:expiration,
       ticket
  })

  await order.save()

  //publish an event saying a new order has been created
  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    status:order.status,
    userId:order.userId,
    expiresAt:order.expiresAt.toISOString(),
    version:order.version,
    ticket:{
      id:ticket.id,
      price:ticket.price
    }
  })


  res.status(201).send(order)
  })

export { router as newOrderRouter };