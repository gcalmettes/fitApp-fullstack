from lmfit.models import LinearModel
import numpy as np
import pandas as pd
import json


def correct_data(xData, yData, startIdx=0):
    y = yData
    # start x at zero
    x = xData - xData[0]

    # linear model
    lr = LinearModel()
    params = lr.make_params()

    # fit model
    xSelection = x[startIdx:]
    ySelection = y[startIdx:]
    outParams = lr.fit(ySelection, params, x=xSelection)

    # construct corrected data
    yRemoved_trend = ySelection - outParams.best_fit + outParams.best_fit[0]
    yCorrected = np.concatenate([yData[:startIdx], yRemoved_trend])

    result = {
        "correctedData": json.loads(
            pd.DataFrame({
                "x": xData.tolist(),
                "y": yCorrected.tolist()
            }).to_json(orient='records')
        )
    }
    return result
