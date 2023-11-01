
import { ExpirationCompleteEvent,Publisher,Subjects } from "@waticket/common"
console.clear()


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}