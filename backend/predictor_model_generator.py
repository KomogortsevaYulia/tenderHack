import pandas as pd
import matplotlib.pyplot as plt
import matplotlib as mpl
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf

from darts import TimeSeries
from darts.models import TCNModel
from darts.metrics import *
from darts.dataprocessing.transformers import Scaler
import logging

mpl.rcParams['figure.dpi'] = 300
logging.disable(logging.CRITICAL)

df_cart = pd.read_csv('cart.csv')
df_cart['datetime'] = df_cart['contract_date'].apply(pd.to_datetime)
df_cart.set_index('datetime', inplace = True)
df_cart = df_cart[['quantity']]
df_cart.dropna(inplace = True)
df_cart = df_cart.resample('W').sum()

df_cart.plot(figsize=(8,5))
plt.title('Monthly Data')
plt.show()

mpl.rcParams['figure.figsize'] = (8, 6)
result_cart = seasonal_decompose(df_cart)
result_cart.plot()
plt.show()

series = TimeSeries.from_dataframe(df_cart)
df_metrics = pd.DataFrame()

def plot_backtest(series, forecast, model_name):
    idx = -144
    series[idx:].plot(label='Actual Values')
    forecast[idx:].plot(label= 'Forecast')
    plt.title(model_name)
    plt.show()
    
def print_metrics(series, forecast, model_name):
    mae_ = mae(series, forecast)
    rmse_ = rmse(series, forecast)
    mape_ = mape(series, forecast)
    smape_ = smape(series, forecast)
    r2_score_ = r2_score(series, forecast)
    dict_ = {'MAE': mae_, 'RMSE': rmse_,'MAPE': mape_, 'SMAPE': smape_, 'R2': r2_score_}
    df = pd.DataFrame(dict_, index = [model_name])
    return(df.round(decimals = 2))

model = TCNModel(
    input_chunk_length=24,
    output_chunk_length=4,
    n_epochs=100,
    dropout=0.2,
    dilation_base=1000,
    weight_norm=True,
    kernel_size=5,
    num_filters=5,
    random_state=0,
)

model_name = 'TCN'

plt.figure(figsize = (8, 5))

scaler = Scaler()
scaled_series = scaler.fit_transform(series)
forecast = model.historical_forecasts(scaled_series, forecast_horizon=12, verbose=True)
plot_backtest(series, scaler.inverse_transform(forecast), model_name)
df_dl = print_metrics(series, scaler.inverse_transform(forecast), model_name)
df_metrics = df_metrics.append(df_dl)

plt.show()
print(df_dl)

model = TCNModel(seasonal_periods = 10)
model_name = 'TCNModel'

model.fit(series)
forecast = model.predict(4)

plot_backtest(series, forecast, model_name)
print(forecast.pd_dataframe())
