import { NewGravatar, UpdatedGravatar } from '../generated/Gravity/Gravity'
import { Gravatar } from '../generated/schema'

// Look in subgraph.yaml mapping.eventHandlers. Both handlers defined there are present here. 
//What this does? 1. imports event NewGravatar (can see this in contract Gravity.sol and subgraph.yaml)
export function handleNewGravatar(event: NewGravatar): void {
    //2. creates new gravatar entity with below line
  let gravatar = new Gravatar(event.params.id.toHex()) //This will be the id value in schema.graphql
  //these will be all other data points specified in sechema.graphql
  gravatar.owner = event.params.owner 
  gravatar.displayName = event.params.displayName
  gravatar.imageUrl = event.params.imageUrl
  //Saves the entity
  gravatar.save()
}

//This handler tries to load existing gravatar from Graph Node store
export function handleUpdatedGravatar(event: UpdatedGravatar): void {
  let id = event.params.id.toHex() //pass in the ID from the event. 
  let gravatar = Gravatar.load(id) //Load gravatar with that ID
  if (gravatar == null) { //if does not exist. Create new gravatar.
    gravatar = new Gravatar(id)
  }
  gravatar.owner = event.params.owner
  gravatar.displayName = event.params.displayName
  gravatar.imageUrl = event.params.imageUrl
  gravatar.save()
}

// How to check reverts
/*
 let gravity = Gravity.bind(event.address)
  let callResult = gravity.try_gravatarToOwner(gravatar)
  if (callResult.reverted) {
    log.info("getGravatar reverted", [])
  } else {
    let owner = callResult.value
  }*/


//Example of how to use Exchange template
/*
 * 
 *  import { Exchange } from '../generated/templates'

    export function handleNewExchange(event: NewExchange): void {
        // Start indexing the exchange; `event.params.exchange` is the
        // address of the new exchange contract
        Exchange.create(event.params.exchange)
        
        //Can also pass extra configuration 
        //ex. exchanges associated with particular trading pair. included in event NewExchange
        let context = new DataSourceContext()
        context.setString("tradingPair", event.params.tradingPair)
        Exchange.createWithContext(event.params.exchange, context)
    }
    
    Can now be accessed like so 
    import {dataSource } from "@graphprotocol/graph-ts"
    let context = dataSource.context()
    let tradingPair = context.getString("tradingPair")
 * 
 * 
 */



//Example of how to mapp the callHandler
// import { CreateGravatarCall } from '../generated/Gravity/Gravity'
// import {Transaction } from '../generated/schema'
// 
//          CreateGravatarCall is created when run graph codegen
// export function handleCreateGravatar(call: CreateGravatarCall): void {
//   let id = call.transaction.hash.toHex()
//   let transaction = new Transaction(id)
//   transaction.displayName = call.inputs._displayName
//   transaction.imageUrl = call.inputs._imageUrl
//   transaction.save()
// }


// //Example of how to map the blockHandler
// import { ethereum } from '@graphprotocol/graph-ts'
// 
// export function handleBlock(block: ethereum.Block): void {
//   let id = block.hash.toHex()
//   let entity = new Block(id)
//   entity.save()
// }











