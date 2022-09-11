from datetime import datetime
from flask import Flask, request, jsonify
import pandas as pd

from darts import TimeSeries
# from darts.models.forecasting.tcn_model import TCNModel
# from darts.models.forecasting.tcn_model import TCNModel
from darts.metrics import *
from darts.models import *
from darts.dataprocessing.transformers import Scaler

app = Flask(__name__)
app.debug = True

@app.route('/predict', methods=['POST'])
def hello_world():
    content = request.get_json(force=True)['data']
    df_cart = pd.DataFrame(content)
    df_cart['datetime'] = df_cart['date'].apply(pd.to_datetime)
    df_cart.set_index('datetime', inplace = True)
    df_cart = df_cart[['count']]
    df_cart.dropna(inplace = True)
    df_cart = df_cart.resample('W').sum()
    series = TimeSeries.from_dataframe(df_cart)

    model = TCNModel.load('model.pt')
    model = TCNModel( input_chunk_length=14, output_chunk_length=7)

    model.fit(series)
    forecast = model.predict(7)

    print(forecast.pd_dataframe())
    return {"data":forecast.to_json()}