import lmfit
import pandas as pd
import numpy as np

########################################
# Fitting models
########################################

## Single exponential composite
## and correspondind initial parameters

def makeSingleExpoModel():
    constant = lmfit.models.ConstantModel()
    expoDecay = lmfit.models.ExponentialModel()
    model = expoDecay + constant
    return [model, expoDecay, constant]


def makeSingleModelParams(model, c=1.4, d1=15., a1=0.5):
    params = model.make_params()
    params['c'].set(c)
    params['decay'].set(d1, min=0.1, max=80.)
    params['amplitude'].set(a1)
    return params


## Double decreasing exponential composite Model
## and correspondind initial parameters

def makeDoubleExpoModel(prefix1='exp1_', prefix2='exp2_'):
    constant = lmfit.models.ConstantModel()
    expoDecay1 = lmfit.models.ExponentialModel(prefix=prefix1)
    expoDecay2 = lmfit.models.ExponentialModel(prefix=prefix2)
    model = expoDecay1 + expoDecay2 + constant
    return [model, expoDecay1, expoDecay2, constant]


def makeDoubleModelParams(model, c=1.4, d1=15., a1=0.5, d2=200, a2=0.5, 
                    prefix1='exp1_', prefix2='exp2_'):
    params = model.make_params()
    params['c'].set(c)
    params[f'{prefix1}decay'].set(d1, min=2., max=80.)
    params[f'{prefix1}amplitude'].set(a1, min=0.)
    params[f'{prefix2}decay'].set(d2, min=50., max=800)
    params[f'{prefix2}amplitude'].set(a2, min=0.)
    return params

########################################
# Fitting routine
########################################

def fitModel(xData, yData, model='DbleExponentialDown'):

    if model == 'DbleExponentialDown':
        # make composite model
        components = makeDoubleExpoModel()
        [fullModel, *subComponents] = components
        params = makeDoubleModelParams(fullModel, c=1.4, d1=15.5, a1=10, d2=200, a2=0.5)

    if model == 'SingleExponentialUp':
        # make composite model
        components = makeSingleExpoModel()
        [fullModel, *subComponents] = components
        params = makeSingleModelParams(fullModel, c=1.7, d1=15., a1=0.5)
    if model == 'SingleExponentialDown':
        # make composite model
        components = makeSingleExpoModel()
        [fullModel, *subComponents] = components
        params = makeSingleModelParams(fullModel, c=1.7, d1=15., a1=-0.5)

    if model == 'Reference':
        x = xData - xData[0]
        y = np.zeros_like(x)
        y[:int(len(y)/2)] = yData[0]
        y[int(len(y)/2):] = yData[-1]
        result = {
            # composite model
            "model": {
                "name": "Model(delta) + Model(constant)",
                "params": {"c": yData[0], "amplitude": yData[-1]-yData[0]},
                "x0": x.tolist(),
                "x": xData.tolist(),
                "y": y.tolist()
            },
            # sub components
            "components": [{
                "name": "Model(delta)",
                "params": ["c", "amplitude"],
                "y": y.tolist()
            }]
        }
        return result

    y = yData
    # start x at zero
    x = xData - xData[0]
    # fit model
    outParams = fullModel.fit(y, params, x=x)

    result = {
        # composite model
        "model": {
            "name": fullModel.name,
            "params": outParams.best_values,
            "x0": x.tolist(),
            "x": xData.tolist(),
            "y": fullModel.eval(outParams.params, x=x).tolist()
        },
        # sub components
        "components": [{
            "name": comp.name,
            "params": comp.param_names,
            "y": comp.eval(outParams.params, x=x).tolist()
        } for comp in subComponents]
    }
    return result
