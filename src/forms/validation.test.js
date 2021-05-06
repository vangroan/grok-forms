import { chain } from "./validation";


const checkMinValue = (minValue) => ({ value }) => parseFloat(value) >= minValue ? true : false;


test('add check function', () => {
    expect(chain({}).check(() => true).check(() => false).count).toBe(2);
});

test('validator precedence', () => {
  let val = 0;

  chain({})
    .check(() => {
      val = 1;
      return true;
    })
    .check(() => {
      val = 2;
      return true;
    })
    .validate();

    expect(val).toBe(2);
});
