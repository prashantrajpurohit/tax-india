export enum ApiStatus {
  STATUS_100 = 100, // informational
  STATUS_200 = 200, // successful response
  STATUS_201 = 201, // successful response
  STATUS_400 = 400, // bad request client error
  STATUS_401 = 401, // unauthenticated
  STATUS_402 = 402, // Store In-Action
  STATUS_404 = 404, // not found
  STATUS_406 = 406, // not found
  STATUS_409 = 409, // conflict
  STATUS_422 = 422, // unprocessable entity
  STATUS_500 = 500, // server error responses
  STATUS_403 = 403, // forbidden
}

export const GradientCardClass =
  "*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-4";
