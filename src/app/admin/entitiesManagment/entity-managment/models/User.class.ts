// export numbererface User { ?
export abstract class User {

  constructor(
              public firstName: string,
              public lastName: string,
              public mobilePhone: string,
              public city: string,
              public email: string,
              public telephone?: string) {
  }

}

