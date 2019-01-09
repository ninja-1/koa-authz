// Copyright 2018 The Casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const BasicAuthorizer = require('./BasicAuthorizer')

// authz returns the authorizer, uses a Casbin enforcer as input
module.exports = function authz (options, Enforcer) {
  return async (ctx, next) => {
    try {
      const {newEnforcer, authorizer} = options
      const enforcer = await newEnforcer()
      if (!(enforcer instanceof Enforcer)) {
        throw new Error('Invalid enforcer')
      }
      const authzorizer = authorizer ? authorizer(ctx, enforcer) : new BasicAuthorizer(ctx, enforcer)
      if (!(authzorizer instanceof BasicAuthorizer)) {
        throw new Error('Please extends BasicAuthorizer class')
      }
      if (!authzorizer.checkPermission()) {
        ctx.status = 403
      }
      await next()
    } catch (e) {
      throw e
    }
  }
}
