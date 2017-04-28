export default class {
  static load(componentName)
  {
    var component = require('components/' + componentName + '/component.vue');

    return component;
  }
}
