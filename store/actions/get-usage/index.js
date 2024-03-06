import * as types from '../../action-types';
import AxiosCall from '../../../utils/axios';
import ErrorHandler from '../../../utils/error-handler';

export const getUsageStart = () => ({
  type: types.GET_USAGE_START,
});

export const getUsageSuccess = (payload) => ({
  type: types.GET_USAGE_SUCCESS,
  payload,
});

export const getUsageFail = (payload) => ({
  type: types.GET_USAGE_FAIL,
  payload,
});

export const getUsageCleanup = () => ({
  type: types.GET_USAGE_CLEANUP,
});

export const getUsage = () => async (dispatch) => {
  try {
    dispatch(getUsageStart());
    const requestObj = {
      path: `/usage`,
      method: 'GET',
      // data: payload,
    };
    const data = await AxiosCall(requestObj);
    dispatch(getUsageSuccess(data));
  } catch (err) {
    const error = ErrorHandler(err);
    dispatch(getUsageFail(error));
  }
};
