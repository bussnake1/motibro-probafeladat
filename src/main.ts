import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import 'primeicons/primeicons.css'

// Import PrimeVue components
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import SelectButton from 'primevue/selectbutton';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import ColorPicker from 'primevue/colorpicker';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Chart from 'primevue/chart';
import ConfirmDialog from 'primevue/confirmdialog';

import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(PrimeVue, {
  theme: 'none'
});
app.use(ToastService);
app.use(ConfirmationService);

// Register PrimeVue components
app.component('Button', Button);
app.component('Column', Column);
app.component('DataTable', DataTable);
app.component('DatePicker', DatePicker);
app.component('Dialog', Dialog);
app.component('InputText', InputText);
app.component('MultiSelect', MultiSelect);
app.component('SelectButton', SelectButton);
app.component('Tabs', Tabs);
app.component('TabList', TabList);
app.component('Tab', Tab);
app.component('TabPanels', TabPanels);
app.component('TabPanel', TabPanel);
app.component('Tag', Tag);
app.component('Textarea', Textarea);
app.component('Toast', Toast);
app.component('ColorPicker', ColorPicker);
app.component('Chart', Chart);
app.component('ConfirmDialog', ConfirmDialog);

app.mount('#app')
