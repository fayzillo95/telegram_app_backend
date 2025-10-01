


export const userApiBody = {
  schema: {
    type: 'object',
    properties: {
      fullName: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
      image: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};

// @ApiBody({
//   schema: {
//     type: 'object',
//     properties: {
//       name: { type: 'string' },
//       about: { type: 'string' },
//       price: { type: 'number' },
//       categoryId: { type: 'string' },
//       mentorId: { type: 'string' },
//       published: { type: 'boolean' },
//       banner: {
//         type: 'string',
//         format: 'binary',
//       },
//       introVideo: {
//         type: 'string',
//         format: 'binary',
//       },
//     },
//   },
// })

//  40.790927, 72.332137
