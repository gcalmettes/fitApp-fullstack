import lmfit
import pandas as pd


########################################
# Composite Model and initial parameters
########################################

def makeDoubleExpoModel(prefix1='exp1_', prefix2='exp2_'):
    constant = lmfit.models.ConstantModel()
    expoDecay1 = lmfit.models.ExponentialModel(prefix=prefix1)
    expoDecay2 = lmfit.models.ExponentialModel(prefix=prefix2)
    model = expoDecay1 + expoDecay2 + constant
    return [model, expoDecay1, expoDecay2, constant]


def makeModelParams(model, c=1.4, d1=15., a1=0.5, d2=200, a2=0.5, 
                    prefix1='exp1_', prefix2='exp2_'):
    params = model.make_params()
    params['c'].set(c)
    params[f'{prefix1}decay'].set(d1, min=2., max=80.)
    params[f'{prefix1}amplitude'].set(a1, min=0.)
    params[f'{prefix2}decay'].set(d2, min=50., max=800)
    params[f'{prefix2}amplitude'].set(a2, min=0.)
    return params


def fitModel(xData, yData, bounds):
    # make composite model
    components = makeDoubleExpoModel()
    fullModel = components[0]
    params = makeModelParams(fullModel, c=1.4, d1=15.5, a1=10, d2=200, a2=0.5)

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
