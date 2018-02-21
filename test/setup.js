import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { LocalStorage } from 'node-localstorage';
import UUID from 'uuid/v4';

Enzyme.configure({ adapter: new Adapter() });
global.localStorage = window.localStorage = new LocalStorage(`/tmp/${UUID()}`);
