import lmfit
import pandas as pd


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


def makeSingleModelParams(model, c=1.4, d1=15., a1=0.5, decreasing=True):
    params = model.make_params()
    params['c'].set(c)
    params['decay'].set(d1, min=0.1, max=80.)
    if decreasing:
        params['amplitude'].set(a1, min=0.)
    else:
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

def fitModel(xData, yData, bounds, model='doubleDecreasingExpo'):

    if model == 'doubleDecreasingExpo':
        # make composite model
        components = makeDoubleExpoModel()
        fullModel = components[0]
        params = makeDoubleModelParams(fullModel, c=1.4, d1=15.5, a1=10, d2=200, a2=0.5)

    if model == 'singleDecreasingExpo':
        return

    lim1, lim2 = bounds
    mask = (xData >= xData[lim1]) & (xData <= xData[lim2])
    xRaw = xData[mask]
    y = yData[mask]
    # start x at zero
    x = xRaw - xRaw[0]
    # fit model
    outParams = fullModel.fit(y, params, x=x)

    outComponents = [[x, xRaw, comp.eval(outParams.params, x=x)] for comp in components]
    return [outParams, outComponents]
