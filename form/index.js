import Form from './Form'

/**
 * Factory to create a new form, returns the interface.
 * 
 * @param {*} options 
 * @param {*} fields 
 * @returns 
 */
function createUserForm(options = {}, fields = null) {
  const form = new Form(options, fields)
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