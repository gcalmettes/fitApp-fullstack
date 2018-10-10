import io
import base64
import pandas as pd
import json

def convertUrlToBytesStream(url):
    # isolate base64 encoded data part
    data = url.split(',')[-1]
    # decode base64 to bytes
    bytes = base64.urlsafe_b64decode(data)
    return bytes

def csvUrlToDf(url):
    bytes = convertUrlToBytesStream(url)
    df = pd.read_csv(io.BytesIO(bytes))
    return df

def xlsUrlToDf(url):
    bytes = convertUrlToBytesStream(url)
    df = pd.read_excel(io.BytesIO(bytes))
    return df

flatten = lambda l: [item for sublist in l for item in sublist]

def getDfInfo(df):
    nCols = df.shape[1]
    nTraces = (nCols-1)/3
    if nTraces%1 == 0:
        return {"type": "all", "nTraces": int(nTraces)}
    elif (nCols%2 == 0):
        return {"type": "processed", "nTraces": int(nCols/2)}
       
def getColumnNames(df, dfInfo):
    if dfInfo['type'] == "all":
        names = ["time"]+flatten([
          [f"yfp{i}", f"cfp{i}", f"ratio{i}"] for i in range(dfInfo["nTraces"])])
    elif dfInfo['type'] == 'processed':
        names = flatten([[f"time{i}", f"ratio{i}"] for i in range(dfInfo["nTraces"])])
    return names

def getCleanedDf(df, fmt='all'):
    if fmt=='all':
        df = df[[col for ratio in df.filter(regex='ratio') for col in ['time', ratio]]]
    elif fmt == 'processed':
        pass
    return df

def convertToJsonObject(df, nTraces):
    df.columns = flatten([['x', 'y'] for i in range(nTraces)])
    dataObject = {'size': nTraces,
                  'data': {}}
    for i in range(nTraces):
        dataObject['data'][f'trace{i}'] = json.loads(
          df.iloc[:, i*2:i*2+2].to_json(orient='records'))
    return dataObject


def processFile(fileUrl, fmt='xls'):
    if fmt == 'xls':
        df = xlsUrlToDf(fileUrl).dropna()
    elif fmt == 'csv':
        df = csvUrlToDf(fileUrl).dropna()
    dfInfo = getDfInfo(df)
    df.columns = getColumnNames(df, dfInfo)
    df = getCleanedDf(df, fmt=dfInfo["type"])
    json = convertToJsonObject(df, dfInfo["nTraces"])
    return json

def convertJSONtoDF(data):
    try:
      converted = pd.read_json(data, orient='records')
    except:
      converted = pd.DataFrame(data)
    return converted

