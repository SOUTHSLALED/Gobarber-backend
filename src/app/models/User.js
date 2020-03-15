import { Model, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      // esses campos não precisam ser
      // todos os campos do model
      // podem ser só os que o usuario
      // vai preencher
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // virtual é um campo q nao vai existir na base de dados
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },

      {
        sequelize,
      }
    );

    // hook sao trechos de codigo que são executados
    // de forma automatica dependendo do que acontece no model
    // no caso abaixo o tal 'acontecimento' é o beforesave'
    // ele recebe um trigger e uma função

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
