const Tought = require("../models/tought");
const User = require("../models/user");

module.exports = class ToughtController {
  static async showToughts(request, response) {
    const toughtsData = await Tought.findAll({
      include: User,
    });

    const toughts = toughtsData.map((result) => result.get({plain:true}));

    console.log(toughts);

    return response.render("toughts/home", { toughts });
  }

  static async dashboard(request, response) {
    const userId = request.session.userId;

    // Select com join SEQUELIZE
    const user = await User.findOne({
      where: { id: userId },
      include: Tought,
      plain: true,
    });

    if (!user) {
      response.redirect("/login");
    }

    // console.log(user.Toughts)

    const toughts = user.toughts.map((result) => result.dataValues);
    console.log(toughts);

    let emptyTought = false;

    if (toughts.length === 0) {
      emptyTought = true;
    }

    return response.render("toughts/dashboard", { toughts, emptyTought });
  }

  static createTought(request, response) {
    return response.render("toughts/create");
  }

  static async createToughtSave(request, response) {
    const tought = {
      titulo: request.body.titulo,
      userId: request.session.userId,
    };

    try {
      await Tought.create(tought);
      request.flash("message", "Pensamento criado com sucesso!");

      request.session.save(() => {
        response.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log(`Aconteceu um erro: ${error}`);
    }
  }

  static async deleteToughts(request, response) {
    const id = request.body.id;
    const userId = request.session.userId;
    try {
      await Tought.destroy({ where: { id: id, UserId: userId } });
      request.flash("message", "Pensamento removido com sucesso");

      request.session.save(() => {
        return response.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log(`Erro encontrado: ${error}`);
    }
  }

  static async editTought(request, response) {
    const id = request.params.id;
    const tought = await Tought.findOne({ where: { id: id }, raw: true });
    console.log(tought);

    response.render("toughts/edit", { tought });
  }

  static async editToughtSave(request, response) {
    const { id, titulo } = request.body;

    try {
      const tought = await Tought.findByPk(id); // Find by primary key

      if (!tought) {
        return response
          .status(404)
          .json({ message: "Pensamento não encontrado" });
      }
      tought.titulo = titulo;

      await tought.save();

      request.flash("message", "Pensamento atualizado com sucesso!");
      request.session.save(() => {
        response.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log(error);
      return response
        .status(500)
        .json({ message: "Erro interno no servidor!" });
    }
  }
};
