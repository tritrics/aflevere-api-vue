import Form from './Form'

/**
 * Alpha-version
 * Missing:
 * - get validation defintions from Kirby (optional)
 */

function createUserForm(fields, options = {}) {
  const form = new Form(fields, options)
  return {
    fields: form.fields,
    valid: form.valid,
    validate: (immediate) => form.validate(immediate),
    data: () => form.data(),
    submit: async () => await form.submit(),
    reset: () =>form.reset(),
  }
}

/**
 * Plugin
 */
export function createForm(params) {
  return {
    id: 'avlevere-api-vue-form-plugin',
    name: 'form',
    export: {
      createUserForm,
    }
  }
}