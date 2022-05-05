import pgConnector from "../service/pg-connector.js";

class ChatController {
    index(req, res) {
        pgConnector.executeStoredProcedure('get_rooms')
			.then((rooms) => {
				res.render("login", { rooms: rooms });
			}).catch((err) => {
				res.render("login", { rooms: [], error: err });
			});
    }

	chat(req, res) {
		res.render("chat");
	}
}

export default new ChatController();