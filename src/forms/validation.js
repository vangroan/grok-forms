/**
 * Function that can validate an input value.
 * @callback ValdiatorFunc
 * @param    {{ name: string, value: string }} data
 * @returns  {boolean}
 */

/**
 * Utility for chaining validation functions.
 */
export class ValidationChain {
  constructor(data) {
    this.data = data;

    // Number of registered validator functions.
    this.count = 0;

    // Starting head of the linked list
    // is a unit node that always returns valid.
    this.head = (_data) => true;
  }

  /**
   * @param   {ValdiatorFunc}   checkFn 
   * @returns {ValidationChain} This instance to continue the fluent interface.
   */
  check(checkFn) {
    // The old head becomes an upvalue in
    // the new node's closure.
    const next = this.head;

    // Insert a new closure node into the linked list.
    this.head = (data) => {
      if (checkFn(data)) {
        // Next validator is only called when the
        // current one passes.
        //
        // Validators thus have a precedence based
        // on the order they're inserted.
        return next(data);
      } else {
        return false;
      }
    };

    // Keep the count up to date.
    this.count += 1;

    // Builder pattern.
    return this;
  }

  validate() {
    // Kick-off chain.
    return this.head(this.data);
  }
}

/**
 * Utility for chaining validation functions.
 * 
 * @example
 * function validateNotNull({ name, value }) {
 *   return value !== null;
 * }
 * 
 * chain()
 *  .check(validateNotNull)
 *  .validate();
 * 
 * @param {object} data 
 * @param {string} data.name
 * @param {string} data.value
 * @returns 
 */
export const chain = (data) => new ValidationChain(data);
