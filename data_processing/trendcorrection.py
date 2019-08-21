from lmfit.models import LinearModel
import numpy as np
import pandas as pd
import json


def correct_data(xData, yData, startIdx=0, endIdx=-1):
    y = yData
    # start x at zero
    x = xData - xData[0]

    # linear model
    lr = LinearModel()
    params = lr.make_params()

    # fit model
    xSelection = x[startIdx:endIdx]
    ySelection = y[startIdx:endIdx]
    outParams = lr.fit(ySelection, params, x=xSelection)

    # construct corrected data
    linear_trend = x * outParams.best_values['slope'] + outParams.best_values['intercept']
    yCorrected = y - linear_trend + y[0]

    result = {
        "correctedData": json.loads(
            pd.DataFrame({
                "x": xData.tolist(),
                "y": yCorrected.tolist()
            }).to_json(orient='records')
        )
    }
    return result
