import Vue from 'vue';

/*全局组件*/

//import headerTop from '@/components/headerTop';
import vDialog from '@/components/v-dialog';
import vAlert from '@/components/v-alert';
//import vMenu from '@/components/v-menu';
import vHeader from '@/components/v-header';
import vPage from '@/components/v-elem';
import vTable from '@/components/v-table';

import vInput from '@/components/v-input';
import vRadio from '@/components/v-radio';
import vSelect from '@/components/v-select';
import vCheckbox from '@/components/v-checkbox';
import vButton from '@/components/v-buttons';
import vProgress from '@/components/v-progress';
import vSwitch from '@/components/v-switch';

import elInput from '@/components/el-input';


Vue.component(vDialog.name, vDialog);
Vue.component(vAlert.name, vAlert);

Vue.component(vHeader.name, vHeader);
Vue.component(vPage.name, vPage);
Vue.component(vTable.name, vTable);

Vue.component(vInput.name, vInput);
Vue.component(vRadio.name, vRadio);
Vue.component(vSelect.name, vSelect);
Vue.component(vCheckbox.name, vCheckbox);
Vue.component(vButton.name, vButton);
Vue.component(vProgress.name, vProgress);
Vue.component(vSwitch.name, vSwitch);


Vue.component(elInput.name, elInput);


import '@/directives';

//过滤器
Vue.filter('upperCase', function (value) {
  if (!value) return '';
  value = value.toUpperCase();
  return value;
});
