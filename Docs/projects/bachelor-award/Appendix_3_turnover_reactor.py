#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Mar 17 10:57:01 2022

@author: EmmaMoerk
"""


import pandas as pd
import numpy as np
import datetime
import seaborn as sns
import matplotlib.pyplot as plt


    
##############################################################################

# Import data

df = pd.read_excel ('Data_lab_Individual.xlsx','Reactors') 
date = list(dict.fromkeys(df['Date']))


##############################################################################

# Code to calculate the average of control reactors.


# First it is calculated for the coal controls
OCP_coal = np.zeros(len(df.loc[(df['Reactor'] == 'CC1')]['Pot.']))


for l in range(len(OCP_coal)):
    liste = list(df.loc[(df['Reactor'] == 
                         'CC1')]['Pot.'])[l], list(df.loc[(df['Reactor'] == 
                         'CC2')]['Pot.'])[l],list(df.loc[(df['Reactor'] == 
                         'CC3')]['Pot.'])[l]
    OCP_coal[l] = np.mean(liste) 
    # Calculates averages of coal control OCP for each measuring date

OCP_coal = (OCP_coal[1:])*10**-3 # Skips day 0 and converts from mV to V.




# Now calculated for steel controls.
OCP_steel = np.zeros(len(df.loc[(df['Reactor'] == 'SC1')]['Pot.']))

for l in range(len(OCP_steel)):
    liste2 = list(df.loc[(df['Reactor'] == 'SC1')]['Pot.'])[l], 
    list(df.loc[(df['Reactor'] == 'SC2')]['Pot.'])[l],
    list(df.loc[(df['Reactor'] == 'SC3')]['Pot.'])[l]
    
    OCP_steel[l] = np.mean(liste2) 
OCP_steel = (OCP_steel[1:])*10**-3 
    


##############################################################################

# Code to calculate time in seconds between measuring dates 
# The output t is a vector of time from day to day.
t = np.zeros(len(df.loc[(df['Reactor'] == 'CC1')]['Pot.'])-1)

for k in range(len(t)):
    x = [int(i) for i in str(date[k]).split('.')] 
    # This splits the dates and converts the individual values to integer.
    x = datetime.datetime(2022, x[1], x[0]) 
    # This convers to a date which can be calculated in the next.
    y = [int(i) for i in str(date[k+1]).split('.')] 
    # Finds the date after the one above.
    
    y = datetime.datetime(2022,y[1],y[0])
    diff = y-x 
    # Calculates the different between the two dates
    t[k] = diff.total_seconds() 
    # Converts the different from days to seconds


##############################################################################


# Carbon turnover

# Given values
n = 8 # number of electrons transfered
F = 96.485 # Faraday constant [coulombs/mole]
R = 1000 # ohm

names_coal = ['C1', 'C2', 'C3']
names_steel = ['S1', 'S2', 'S3']

m_coal = np.empty((len(t),0))
m_steel = np.empty((len(t),0))

 
for i in range(len(names_coal)):
    WP_coal = df.loc[(df['Reactor'] == names_coal[i])]['Pot.'].dropna()*10**-3
    WP_coal = WP_coal[1:]
    m_coal1 = np.cumsum((WP_coal**2*t) / (R*n*F*OCP_coal))
    # the potential is converted from mV to V and then m is calculated
    # m is given in the unit mole
    m_coal1 = m_coal1[:,np.newaxis]
    # m_coal1 is reshaped to become an matrix which can be appended
    m_coal = np.append(m_coal,m_coal1,1)
    
    WP_steel = df.loc[(df['Reactor'] == names_steel[i])]['Pot.'].dropna()*10**-3
    WP_steel = WP_steel[1:]
    m_steel1 = np.cumsum((WP_steel**2*t) / (R*n*F*OCP_steel))
    # the potential is converted from mV to V
    m_steel1 = m_steel1[:,np.newaxis]
    # m_steel1 is reshaped to become an matrix which can be appended
    m_steel = np.append(m_steel,m_steel1,1)



##############################################################################

# Make table. I think it is possible to export to Latex

dict = {'C1':m_coal[:,0], 'C2':m_coal[:,1],'C3':m_coal[:,2]}
Coal_turnover1 = pd.DataFrame(dict) * (-1) # Abs. value
Coal_turnover1
# print(table1.to_latex()) #Activate to get a latex code


dict = {'S1':m_steel[:,0], 'S2':m_steel[:,1],'S3':m_steel[:,2]}
Steel_turnover1 = pd.DataFrame(dict) * (-1) # Abs. value
Steel_turnover1
# print(table2.to_latex()) #Activate to get a latex code

##############################################################################


# Plot turnovers

x = np.unique(df['Day'])[1:-4] # skip day 0 and after day 35
plt.plot(x, Coal_turnover1['C1'][:-4], label = "C1", c = 'black', marker='o')
plt.plot(x, Coal_turnover1['C2'][:-4], label = 'C2', c = 'black')
plt.plot(x, Coal_turnover1['C3'][:-4], label = "C3", c = 'black')
plt.plot(x, Steel_turnover1['S1'][:-4], label = 'S1', c = 'red')
plt.plot(x, Steel_turnover1['S2'][:-4], label = 'S2', c = 'red')
plt.plot(x, Steel_turnover1['S3'][:-4], label = 'S3', c = 'red')
plt.legend()
plt.show()
##############################################################################

# Sulfide turnover


# Given values
n = 2 # number of electrons transfered
F = 96.485 # Faraday constant [coulombs/mole]
R = 1000 # ohm

names_coal = ['C1', 'C2', 'C3']
names_steel = ['S1', 'S2', 'S3']

m_coals = np.empty((len(t),0))
m_steels = np.empty((len(t),0))

 
for i in range(len(names_coal)):
    WP_coal = df.loc[(df['Reactor'] == names_coal[i])]['Pot.'].dropna()*10**-3
    WP_coal = WP_coal[1:]
    m_coal1 = np.cumsum((WP_coal**2*t) / (R*n*F*OCP_coal))
    # the potential is converted from mV to V and then m is calculated
    # m is given in the unit mole
    m_coal1 = m_coal1[:,np.newaxis]
    # m_coal1 is reshaped to become an matrix which can be appended
    m_coals = np.append(m_coals,m_coal1,1)
    
    WP_steel = df.loc[(df['Reactor'] == names_steel[i])]['Pot.'].dropna()*10**-3
    WP_steel = WP_steel[1:]
    m_steel1 = np.cumsum((WP_steel**2*t) / (R*n*F*OCP_steel))
    # the potential is converted from mV to V
    m_steel1 = m_steel1[:,np.newaxis]
    # m_steel1 is reshaped to become an matrix which can be appended
    m_steels = np.append(m_steels,m_steel1,1)



##############################################################################

# Make table. I think it is possible to export to Latex

# For coal
dict = {'C1':m_coals[:,0], 'C2':m_coals[:,1],'C3':m_coals[:,2]}
Coal_turnover2 = pd.DataFrame(dict) * (-1) #Abs. value
Coal_turnover2 # Abs. value
# print(table1.to_latex()) #Activate to get a latex code


# For steel
dict = {'S1':m_steels[:,0], 'S2':m_steels[:,1],'S3':m_steels[:,2]}
Steel_turnover2 = pd.DataFrame(dict) * (-1) # Abs. value
Steel_turnover2
# print(table2.to_latex()) #Activate to get a latex code

#Plot turnovers

x = np.unique(df['Day'])[1:-4]
plt.plot(x, Coal_turnover2['C1'][:-4], label = "C1", c = 'limegreen', marker='o')
plt.plot(x, Coal_turnover2['C2'][:-4], label = 'C2', c = 'limegreen', marker='x')
plt.plot(x, Coal_turnover2['C3'][:-4], label = "C3", c = 'limegreen', marker='v')
plt.plot(x, Steel_turnover2['S1'][:-4], label = 'S1', c = 'blue', marker='o')
plt.plot(x, Steel_turnover2['S2'][:-4], label = 'S2', c = 'blue', marker='x')
plt.plot(x, Steel_turnover2['S3'][:-4], label = 'S3', c = 'blue', marker='v')
plt.ylabel('mol')
plt.xlabel('Day')
plt.legend()
plt.savefig('Turnover_sulphide_reactor',bbox_inches='tight',pad_inches = 0.1, dpi=500)
plt.show()

x = np.unique(df['Day'])[1:-4]
plt.plot(x, Coal_turnover2['C1'][:-4], label = "C1", c = 'black', marker='o')
plt.plot(x, Coal_turnover2['C2'][:-4], label = 'C2', c = 'black', marker='x')
plt.plot(x, Coal_turnover2['C3'][:-4], label = "C3", c = 'black', marker='v')
plt.plot(x, Steel_turnover2['S1'][:-4], label = 'S1', c = 'red', marker='o')
plt.plot(x, Steel_turnover2['S2'][:-4], label = 'S2', c = 'red', marker='x')
plt.plot(x, Steel_turnover2['S3'][:-4], label = 'S3', c = 'red', marker='v')
plt.legend()
#plt.savefig('Turnover_sulphide_reactor',bbox_inches='tight',pad_inches = 0.1, dpi=500)
plt.show()


##############################################################################

# New calculations for after day 35.

t2 = t[-4:]
OCP_coal2 = OCP_coal[-4:]*(-1)
# The new resistors

R4700 = 4700
R560 = 560


# Carbon

n = 8

# C1
WP = df.loc[(df['Reactor'] == 'C1')]['Pot.'].dropna()*10**-3
WP = WP[-4:]*(-1) # Only take the two last measurements (after day 35)
mC1 = np.cumsum(WP**2 * t2 / (R4700*n*F*OCP_coal2)) + Coal_turnover1['C1'][14]

# C2
WP = df.loc[(df['Reactor'] == 'C2')]['Pot.'].dropna()*10**-3
WP = WP[-4:]*(-1) # Only take the two last measurements (after day 35)
mC2 = np.cumsum(WP**2 * t2 / (R4700*n*F*OCP_coal2)) + Coal_turnover1['C2'][14]

# C3
WP = df.loc[(df['Reactor'] == 'C3')]['Pot.'].dropna()*10**-3
WP = WP[-4:]*(-1) # Only take the two last measurements (after day 35)
mC3 = np.cumsum(WP**2 * t2 / (R560*n*F*OCP_coal2)) + Coal_turnover1['C3'][14]

# S1
WP = df.loc[(df['Reactor'] == 'S1')]['Pot.'].dropna()*10**-3
WP = WP[-4:]*(-1) # Only take the two last measurements (after day 35)
mS1 = np.cumsum(WP**2 * t2 / (R4700*n*F*OCP_coal2)) +  Steel_turnover1['S1'][14]

# S2
mS2 = Steel_turnover1['S1'][-4:] 

# S3
mS3 = Steel_turnover1['S3'][-4:] 


# For sulphide

n = 2

# C1
WP = df.loc[(df['Reactor'] == 'C1')]['Pot.'].dropna()*10**-3
WP = WP[-4:]*(-1) # Only take the four last measurements (after day 35)
m2C1 = np.cumsum(WP**2 * t2 / (R4700*n*F*OCP_coal2)) + Coal_turnover2['C1'][14]

# C2
WP = df.loc[(df['Reactor'] == 'C2')]['Pot.'].dropna()*10**-3
WP = WP[-4:]*(-1) # Only take the two last measurements (after day 35)
m2C2 = np.cumsum(WP**2 * t2 / (R4700*n*F*OCP_coal2))  + Coal_turnover2['C2'][14]

# C3
WP = df.loc[(df['Reactor'] == 'C3')]['Pot.'].dropna()*10**-3
WP = WP[-4:]*(-1) # Only take the two last measurements (after day 35)
m2C3 = np.cumsum(WP**2 * t2 / (R560*n*F*OCP_coal2))  + Coal_turnover2['C3'][14]

# S1
WP = df.loc[(df['Reactor'] == 'S1')]['Pot.'].dropna()*10**-3
WP = WP[-4:]*(-1) # Only take the two last measurements (after day 35)
m2S1 = np.cumsum(WP**2 * t2 / (R4700*n*F*OCP_coal2))  +  Steel_turnover2['S1'][14]

# S2
m2S2 = Steel_turnover2['S2'][-4:] 

# S3
m2S3 = Steel_turnover2['S3'][-4:]  

# Plot with cumulative values from before and after day 35

ba35C1 = np.append(Coal_turnover2['C1'][:-4],m2C1)
ba35C2 = np.append(Coal_turnover2['C2'][:-4],m2C2)
ba35C3 = np.append(Coal_turnover2['C3'][:-4],m2C3)

ba35S1 = np.append(Steel_turnover2['S1'][:-4],m2S1)
ba35S2 = np.append(Steel_turnover2['S2'][:-4],m2S2)
ba35S3 = np.append(Steel_turnover2['S3'][:-4],m2S3)

x = np.unique(df['Day'])[1:]
plt.plot(x, ba35C1, label = "C1", c = 'limegreen', marker='o')
plt.plot(x, ba35C2, label = 'C2', c = 'limegreen', marker='x')
plt.plot(x, ba35C3, label = "C3", c = 'limegreen', marker='v')
plt.plot(x, ba35S1, label = 'S1', c = 'blue', marker='o')
plt.plot(x, ba35S2, label = 'S2', c = 'blue', marker='x')
plt.plot(x, ba35S3, label = 'S3', c = 'blue', marker='v')
plt.ylabel('mol')
plt.xlabel('Day')
plt.axvline(x=35, color='black',linestyle='--',label = 'New \u03A9')
plt.legend()
plt.savefig('Turnover_sulphide_reactorBA35',bbox_inches='tight',pad_inches = 0.1, dpi=500)
plt.show()