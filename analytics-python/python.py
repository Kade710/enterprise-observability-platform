import time
import pandas as pd
import numpy as np

print('Analytics service started')

while True:
    data = np.random.rand(10)
    df = pd.DataFrame(data, colums=['metric'])
    print('MNeam metric:', df['metric'].mean())
    time.sleep(10)