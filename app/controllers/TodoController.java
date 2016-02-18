package controllers;

import java.util.UUID;

import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import actions.CorsComposition.Cors;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;

@Cors
public class TodoController extends Controller {

	
	public Result list() {
		return status(200, "Hello");
	}
	public DBCollection dataMongo() {
		MongoClient mongo = new MongoClient("localhost", 27017);

		DB db = mongo.getDB("ToDoList");

		DBCollection collection = db.getCollection("List2");
		return  collection;

	}
	public ArrayNode getDataMongo(DBCollection collection){
		ArrayNode array = Json.newArray();
		DBCursor cursor = collection.find();
		while (cursor.hasNext()) {
			DBObject object = cursor.next();
			
			ObjectNode node = Json.newObject();
			node.put("_id", object.get("_id").toString());
			node.put("value", object.get("value").toString());
			array.add(node);
		}
		return array ;
		
	}
	public void putDataMongo(DBCollection collection, String key, String value){
		BasicDBObject document = new BasicDBObject();
		document.put("_id", key);
		document.put("value", value);
		collection.insert(document);
	}

	public Result loadPage() {
		response().setContentType("text/json");
		DBCollection collection = dataMongo();
		ArrayNode array = getDataMongo(collection);
		
		return status(200,array);
	}
	
	public Result addNewItem(){
		String id = UUID.randomUUID().toString();
		DBCollection collection = dataMongo();
		String json = request().body().asFormUrlEncoded().get("todo")[0];
		putDataMongo(collection, id, json);
		
		return ok(id);
	}
	
	public Result deleteOneItem(){
		DBCollection collection = dataMongo();
		String id = request().getQueryString("id");
		DBObject query = new BasicDBObject("_id", id);
		collection.remove(query);

        ArrayNode array = getDataMongo(collection);
		
		return ok(""+array.size());
	}
	
	public Result deleteItems(){
		DBCollection collection = dataMongo();
		int length = request().body().asFormUrlEncoded().get("listID[]").length;
		for (int i = 0; i < length; i++) {
			String id = request().body().asFormUrlEncoded().get("listID[]")[i];
			DBObject query = new BasicDBObject("_id", id);
			collection.remove(query);
		}
		ArrayNode array = getDataMongo(collection);
		
		return ok(""+array.size());
	}
	
	public Result editItem(){
		String id = request().body().asFormUrlEncoded().get("EDIT[]")[0];
		String value = request().body().asFormUrlEncoded().get("EDIT[]")[1];
		DBCollection collection = dataMongo();
		DBObject query = new BasicDBObject("_id", id);
		DBObject queryUpdate = new BasicDBObject("value",value);
		collection.update(query, queryUpdate);
		
		return ok("");
	}

	
}
