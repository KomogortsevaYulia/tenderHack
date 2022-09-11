from datetime import datetime
import json
import sys
from flask import Flask, request, jsonify
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib as mpl
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf

from darts import TimeSeries
from darts.models.forecasting.tcn_model import TCNModel
from darts.metrics import *
from darts.dataprocessing.transformers import Scaler
import logging
import torch

app = Flask(__name__)
app.debug = True

@app.route('/predict', methods=['POST'])
def hello_world():
    content = request.get_json(force=True)['data']
    
    #print(content[0])
    df_cart = pd.DataFrame(content)
    #print(df_cart)
    df_cart['datetime'] = df_cart['date'].apply(pd.to_datetime)
    df_cart.set_index('datetime', inplace = True)
    df_cart = df_cart[['count']]
    df_cart.dropna(inplace = True)
    df_cart = df_cart.resample('W').sum()
    series = TimeSeries.from_dataframe(df_cart)

    #model = load('model.pt')
    model = TCNModel.load('model.pt')
    model = TCNModel( input_chunk_length=14, output_chunk_length=7)
    model_name = 'Exponential Smoothing'

    model.fit(series)
    forecast = model.predict(7)

    #plot_backtest(series, forecast, model_name)
    print(forecast.pd_dataframe())
    print(forecast.to_json())
    #forecast.to_json()
    return {"data":forecast.to_json()}