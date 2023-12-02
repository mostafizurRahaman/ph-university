# Mongoose

## What is mongoose ?

- Mongoose is an Object Data Modeling library for mongodb.

## Why we use mongoose?

- Schema Definition
- Model Creation
- Data validation
- Querying
- middleware support
- population .

## Some Common Package that we need:

- express
- typescript
- cors
- mongoose
- dotenv
- eslint
- prettier
- ts-node-dev

## Folder structure:

```$tree/md
    $ Express Js Folder structure
.
├── node_modules
│
├── dist/
├── src/
│   ├── app/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│           ├─index.ts
├── package.json
├── tsconfig.json
├── .gitignore
├── .env
└── README.md
      ...
```

### Get Current Path:

- 1st way :

```ts
process.cwd();
```

- 2nd way:

```ts
__dirname;
```

## Configure `dotenv` :

- create :file_folder:`configs` at `src/app/`.
- create create a `index.ts` file :
- write codes:

```ts
import dotenv from 'dotenv';
import path from 'path';

// dotenv setup with process.cwd() :
dotenv.config({ path: path.join(process.cwd() + '.env') });
// console.log(process.cwd() + ".env");

export = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URI,
};
```

## Install & setup Eslint & Prettier :

- #### [read this blog](https://blog.logrocket.com/linting-typescript-eslint-prettier)
- run this command :

```ts
   npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
   // install this packages as dev dependencies:
   // eslint
   // @typescript-eslint/parser
   // @typescript-eslint/eslint-plugin
```

- ### Initialize Eslint or create Eslint configuration:

  - it's provide an configuration. `.eslintrc.json` file
  - run the command :

  ```ts
       npx eslint --init
  ```

  - ##### Then ans the belows question on terminal step by step :

  ```ts
     How would you like to use ESLint?
     What type of modules does your project use?
     Which framework does your project use?
     Does your project use TypeScript?
     Where does your code run?
     How would you like to define a style for your project?
  ```

  - create an `.eslintignore` file and `dist` and `node_modules`

  ```eslint
  dist
  node_modules
  ```

  - ##### Add Two script: `package.json`

  ```json
        "scripts": {
              "lint": "eslint src --ignore-path .eslintignore --ext  .ts",
              "lint:fix": "npx eslint src --fix"
         },
  ```

  - ##### Add some rules : in `.eslintrc.json`

  ```json
     "rules": {
        "/no-unused-vars": "error",
        "no-unused-expressions": "error",
        "prefer-const": "error",
        "no-undef": "error",
        "no-console": "warn"
     },


  ```

  - ##### Add Globals

  ```json
   "globals": {
        "process": "readonly"
     }
  ```

  - ##### Edit extends In `.eslintrc.json` : This helps to save from conflict of prettier and eslint.

  ```json
    "extends": [
   "eslint:recommended",
   "plugin:@typescript-eslint/recommended",
   "prettier"
  ],
  ```

## Install Prettier :

- ### Installation:
  ```ts
     npm install --save-dev prettier
  ```
- ### Create `.prettierrc.json` and this file:

  ```json
  {
    "semi": false, // Specify if you want to print semicolons at the end of statements
    "singleQuote": true // If you want to use single quotes
  }
  ```

- ### Install and `two script` on `package.json` for prettier:
  - to Format with prettier:
  ```json
     "prettier" : "prettier --ignore-path .gitignore --write \"./src/**/*.+(js|ts|json)\",
     "prettier:fix" : "npx prettier --write src"
  ```
- ### Install another `eslint-config-prettier` to handle eslint and prettier
  conflict.
  ```ts
     npm install --save-dev eslint-config-prettier
  ```
- ### Edit extends In `.eslintrc.json` : This helps to save from conflict of prettier and eslint.

  ```json
    "extends": [
   "eslint:recommended",
   "plugin:@typescript-eslint/recommended",
   "prettier"
  ],
  ```

## Install `ts-node-dev` to run `server.ts`:

- ### install :
  ```ts
     npm i ts-node-dev --save-dev
  ```
- ### Add an script on `package.json` :

  ```json
     "start:dev": "ts-node-dev --respawn --transpile-only ./src/server.ts"

  ```

## Software Design Pattern

- There many software design pattern like `mvc` and `modular` pattern
- ### MVC Pattern :

```mermaid
 graph TD

 A[Interface Folder]-->B[Contain all interfaces]

 C[model Folder] --> D[contain all models]

 E[services Folder]-->F[contain all services]

 G[Routes Folder]-->H[contain all Routes]

 J[Folder Controllers]-->I[contain all Controllers]
```

- ### Modular Pattern :

```mermaid
graph TD
subgraph A[Student Folder]
   subgraph B[interface]
      subgraph C[model]
         subgraph D[route]
             subgraph E[controllers]
                F[services]
             end
         end
      end
   end
end

```

```mermaid
graph TD
subgraph A[Teacher Folder]
   subgraph B[interface]
      subgraph C[model]
         subgraph D[route]
             subgraph E[controllers]
                F[services]
             end
         end
      end
   end
end

```

```mermaid
graph TD
subgraph A[Marks Folder]
   subgraph B[interface]
      subgraph C[model]
         subgraph D[route]
             subgraph E[controllers]
                F[services]
             end
         end
      end
   end
end

```

## Benefits of Modular Pattern:

1. Scalability
2. Maintainability
3. Better Refactoring
4. Efficient Development

## Follow rules :

- #### Dry : Don't Repeat Your Code
- #### FAT Model / Thin Controller

## We follow the rules on our express application :

```mermaid

   graph TD

   A[Interfaces] --> B[Schema] --> C[Model]--> D[Database Query]

```

## Request & Response Flow in `Modular Pattern :`

```mermaid

   graph TD

   A[Client]--request-->B[Route]--request-->C[Controller]--request-->D[Services] --request-->E{Database}

   E --response-->D
   D --response-->C
   C --response {success, message, data}-->A
```

# Some Important Middleware Function

- ## Global error handler:

  ```ts
  import { NextFunction, Request, Response } from 'express';

  const globalErrorHandler = async (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const statusCode = 500;
    const message = err.message || 'something went wrong';

    return res.status(statusCode).json({
      success: true,
      message,
      err: '',
    });
  };

  export default globalErrorHandler;
  ```

  - ## NotFound Route Middleware:

  ```ts
  import { NextFunction, Request, Response } from 'express';
  import httpStatus from 'http-status';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  export const notFound = (req: Request, res: Response, next: NextFunction) => {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'API Not Found',
      error: '',
    });
  };
  ```

# Router Management :

- Create a :file_folder: `routes`
- Then create a `index.ts` file
- create an object with routes and it's path
- then loop the route and use `router.use(router.path, router.route)`

- Example :

```ts
import express from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { userRouter } from '../modules/user/user.route';

const router = express.Router();

// router.use('/students', StudentRoutes);
// router.use('/users', userRouter);

const modulesRoute = [
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/users',
    route: userRouter,
  },
];

modulesRoute.forEach((route) => router.use(route.path, route.route));

export default router;
```

# Hoc Function In Express JS:

- ## `catchAsync`: It's a HOC Function thats helps us to don't repeat `try` and `catch`

  - Syntax:

  ```ts
  const catchAsync = (fn: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    };
  };
  ```

  - use Case:

  ```ts
  const getAllStudents: RequestHandler = catchAsync(async (req, res, next) => {
    const students = await StudentServices.getAllStudentFromDB();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student retrieved successfully',
      data: students,
    });
  });
  ```

# Utility Functions:

- ## `sendResponse` : Send Response helps us don't repeat `response` code .

  - Syntax:

    ```ts
    import { Response } from 'express';

    type TResponse<T> = {
      statusCode: number;
      success: boolean;
      message: string;
      data: T;
    };

    const sendResponse = <T>(res: Response, data: TResponse<T>) => {
      res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        data: data.data,
      });
    };

    export default sendResponse;
    ```

  - use Case:

  ```ts
  const getAllStudents: RequestHandler = catchAsync(async (req, res, next) => {
    const students = await StudentServices.getAllStudentFromDB();

    // send response use to send message on client side :
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student retrieved successfully',
      data: students,
    });
  });
  ```

# `Population ` in Mongoose :

- `populate` used to get `ref` field data.

- ### `populate(propertyName)`:

  - syntax:

  ```ts
  Model.find().populate('propertyName');
  ```

  - Example:

  ```ts
  // get students:
  const getAllStudentFromDB = async () => {
    const students = await Student.find({})
      .populate('admissionSemester') // only single property population
      .populate({
        // nested property population
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      });

    return students;
  };
  ```

- ### Nested `population`:

  - syntax :

  ```ts
  Model.find().populate({
    path: 'propertyName', // parent population
    populate: {
      // children property population
      path: 'propertyName',
    },
  });
  ```

  - Example:

  ```ts
  const getAllStudentFromDB = async () => {
    const students = await Student.find({})
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      });

    return students;
  };
  ```

# AppError Class :

- create an app error class to pass status code and stack on `Error` class.
- create a :file_folder:`errors`.
- create :blue_book:`AppError.ts` file
- then write below codes :

```ts
// here we extends Error Class: Error is Super Class and AppError Derived Class
class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string, stack = '') {
    // send message to super class with super key:
    super(message);
    // assign statusCode : get this code from user:
    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      // call the error captureStackTrace() function
      // this func get current object and it's constructor.
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
```

- Use Case:

```ts
throw new AppError(404, 'The user Not exists');
```
