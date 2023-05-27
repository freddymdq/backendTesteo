import passport from 'passport';
import local from 'passport-local';
import userModel from '../Dao/models/user.model.js';
import { createHash, validatePassword } from '../utils.js';
import GithubStrategy from 'passport-github2'

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    'register',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await userModel.findOne({ email: username });
          if (user) {
            console.log('El usuario existe');
            return done(null, false);
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: 'usuario'
          };

          const result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error al registrar el usuario: " + error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });

  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      try {
        if (username === 'admin@admin.com' && password === 'admin') {
          const adminUser = {
            first_name: 'Admin',
            last_name: 'Admin',
            email: username,
            age: 0,
            role: 'admin'
          };
          return done(null, adminUser);
        }

        const user = await userModel.findOne({ email: username });
        if (!user) {
          console.log('No existe el usuario');
          return done(null, false);
        }

        if (!validatePassword(password, user)) return done(null, false);
        return done(null, user);
      } catch (error) {
        return done("Error al intentar ingresar: " + error);
      }
    })
  );

  passport.use('github', new GithubStrategy({
      clientID: 'Iv1.8d20b7aa9310a471',
      clientSecret: '65bbf5ae2e0f3e1ebc6a575d573da79c34a83827',
      callbackURL: 'http://localhost:8080/api/sessions/githubcallback'

    }, async (accesToken, refreshToken,profile,done)=>{
      try {
          
          console.log(profile); //vemos toda la info que viene del profile
          let user = await userModel.findOne({email: profile._json.email})
          if(!user){

              const email = profile._json.email == null ?  profile._json.username : null;

              const newUser = {
                      first_name: profile._json.name,
                      last_name:'',
                      email: email,
                      age: 18,
                      password: '',
                      role: ""
              }
              const result = await userModel.create(newUser);
              done(null,result)
          }else{
              //ya existe
              done(null, user)
          }

      } catch (error) {
          return done(null,error)
      }

  }))
};

export default initializePassport;
