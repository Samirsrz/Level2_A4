export interface IRentalRequest{ 
    startTime:Date,
    endTime:Date,
    propertyId:string,
}


export interface IUpdateRentalRequest{ 
    startTime?:Date,
    endTime?:Date,
    propertyId?:string,
    status?:"APPROVED"|"REJECTED"
}