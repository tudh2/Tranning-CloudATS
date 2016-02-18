package controllers;

import actions.CorsComposition.Cors;
import play.*;
import play.mvc.*;
import views.html.*;

@Cors
public class Application extends Controller {

    public Result index() {
        return ok(index.render("Hello Minh Tu"));
    }
    public Result preflight(String path) {
		return ok("");
	}

}
