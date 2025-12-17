import {createNavigationContainerRef} from '@react-navigation/native';
import {StackActions} from '@react-navigation/native';

export const RootNavigation = createNavigationContainerRef();
export function navigate(name, params) {
  if (RootNavigation.isReady()) {
    RootNavigation.navigate(name, params);
  }
}
export function goBack() {
  if (RootNavigation.canGoBack() && RootNavigation.isReady()) {
    RootNavigation.goBack();
  }
}
export function push(...args) {
  if (RootNavigation.isReady()) {
    RootNavigation.dispatch(StackActions.push(...args));
  }
}
