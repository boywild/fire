import mongoose from 'mongoose'
const Schema = mongoose.Schema

const TokenSchema = new Schema(
  {
    name: String,
    token: String,
    expires_in: Number,
    meta: {
      createdAt: { type: Date, default: Date.now() },
      updatedAt: { type: Date, default: Date.now() }
    }
  },
  { strict: true, strictQuery: true }
)

TokenSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

TokenSchema.static = {
  async getAccessToken() {
    const token = await this.findOne({ name: 'access_token' }).exec()
    if (token && token.token) {
      token.access_token = token.token
    }
    return token
  },
  async saveAccessToken(data) {
    let token = await this.findOne({ name: 'access_token' }).exec()
    if (token) {
      token.token = data.access_token
      token.expires_in = data.expires_in
    } else {
      token = new Token({ token: data.access_token, expires_in: data.expires_in })
    }
    return token
  }
}

const Token = mongoose.Model('Token', TokenSchema)
export default Token