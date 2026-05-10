#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Mar 31 16:16:39 2022

@author: EmmaMoerk
"""

import pandas as pd
import numpy as np
import datetime
import matplotlib.pyplot as plt

 # Import data
df = pd.read_excel ('Data_lab_Individual.xlsx','Boxes')
date = list(dict.fromkeys(df['Date']))


##############################################################################

# Code to calculate the average of control boxes for each measuring.

OCP = np.zeros(len(df.loc[(df['Box'] == 'C-SL1')]['Pot.']))


for l in range(len(OCP)):    
    liste = list(df.loc[(df['Box'] == 
                         'C-SL1')]['Pot.'])[l], list(df.loc[(df['Box'] == 
                         'C-SL2')]['Pot.'])[l], list(df.loc[(df['Box'] == 
                         'C-SL3')]['Pot.'])[l]    
    OCP[l] = np.mean(liste) # udregner gennemsnit af kul kontrol OCP

OCP = (OCP[1:])*10**-3 #Skipper dag 0 og omregner fra mV til V.
    
##############################################################################


# Code to calculate time in seconds between measuring dates 
# The output t is a vector of time from day to day.

t = np.zeros(len(df.loc[(df['Box'] == 'C-SL1')]['Pot.'])-1)

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

names1= ['SL1', 'SL2', 'SL3']
names2 = ['LL1', 'LL2', 'LL3'] 

m1 = np.empty((len(t),0))
m2 = np.empty((len(t),0))

for i in range (len(names1)):
    WP = df.loc[(df['Box'] == names1[i])]['Pot.'].dropna()*10**-3
    # WP is converted from mV to V by 10**-3
    WP = WP[1:] # Skip første Working Potential (fra dag 0)
    mSL = np.cumsum(WP**2 * t / (R*n*F*OCP)) # m is given in the unit mole
    mSL = mSL[:,np.newaxis] 
    #mSL is reshape to become a matrix which can be appended
    m1 = np.append(m1, mSL, 1)
    #mSL is appended for each name so m1 consists of 3 columns

    WP2 = df.loc[(df['Box'] == names2[i])]['Pot.'].dropna()*10**-3
    WP2 = WP2[1:]
    mLL = np.cumsum(WP2**2 * t / (R*n*F*OCP))
    mLL = mLL[:, np.newaxis]
    m2 = np.append(m2, mLL, 1)



##############################################################################

# Make table. I think it is possible to export to Latex

# Table for large/small with n = 8
dict = {'Large/Small 1':m1[:,0], 'Large/Small 2':m1[:,1],'Large/Small 3':m1[:,2]}
table1 = pd.DataFrame(dict) * (-1) # To get the abs. value
table1
# print(table1.to_latex()) #Activate to get a latex code


# Table for large/large with n = 8
dict = {'Large/Large 1':m2[:,0], 'Large/Large 2':m2[:,1],'Large/Large 3':m2[:,2]}
table2 = pd.DataFrame(dict) * (-1) # To get the abs. value
table2
# print(table1.to_latex()) #Activate to get a latex code


##############################################################################

# Sulfide turnover 

# Given values
n = 2 # number of electrons transfered
F = 96.485 # Faraday constant [coulombs/mole]
R = 1000 # ohm


m3 = np.empty((len(t),0))
m4 = np.empty((len(t),0))

for i in range (len(names1)):
    WP = df.loc[(df['Box'] == names1[i])]['Pot.'].dropna()*10**-3
    # WP is converted from mV to V by 10**-3
    WP = WP[1:] # Skip første Working Potential (fra dag 0)
    mSL = np.cumsum(WP**2 * t / (R*n*F*OCP)) # m is given in the unit mole
    mSL = mSL[:,np.newaxis] 
    #mSL is reshape to become a matrix which can be appended
    m3 = np.append(m3, mSL, 1)
    #mSL is appended for each name so m1 consists of 3 columns

    WP2 = df.loc[(df['Box'] == names2[i])]['Pot.'].dropna()*10**-3
    WP2 = WP2[1:]
    mLL = np.cumsum(WP2**2 * t / (R*n*F*OCP))
    mLL = mLL[:, np.newaxis]
    m4 = np.append(m4, mLL, 1)
    
    
##############################################################################

# Make table. I think it is possible to export to Latex

dict = {'Large/Small 1':m3[:,0], 'Large/Small 2':m3[:,1],'Large/Small 3':m3[:,2]}
table3 = pd.DataFrame(dict) * (-1) # To get the abs. value
table3


dict = {'Large/Large 1':m4[:,0], 'Large/Large 2':m4[:,1],'Large/Large 3':m4[:,2]}
table4 = pd.DataFrame(dict) * (-1) # To get the abs. value
table4

# Carbon plot until day 35 where the resistor is changed. 
x = np.unique(df['Day'])[1:-2]
plt.plot(x, table2['Large/Large 1'][:-2], label = "LL1", c = 'orange', marker = 'o')
plt.plot(x, table2['Large/Large 2'][:-2], label = 'LL2', c = 'orange', marker = 'x')
plt.plot(x, table2['Large/Large 3'][:-2], label = "LL3", c = 'orange', marker = 'v')
plt.plot(x, table1['Large/Small 1'][:-2], label = "SL1", c = 'red', marker ='o')
plt.plot(x, table1['Large/Small 2'][:-2], label = 'SL2', c = 'red', marker = 'x')
plt.plot(x, table1['Large/Small 3'][:-2], label = "SL3", c = 'red', marker = 'v')
plt.ylabel('moles')
plt.xlabel('Day')
plt.axvline(x=35, color='black',linestyle='--',label = 'New \u03A9')
plt.legend()
plt.savefig('Turnover_carbon_box',bbox_inches='tight',pad_inches = 0.1, dpi=500)
plt.show()

# Sulphide plot
x = np.unique(df['Day'])[1:-2]
plt.plot(x, table4['Large/Large 1'][:-2], label = "LL1", c = 'orange', marker = 'o')
plt.plot(x, table4['Large/Large 2'][:-2], label = 'LL2', c = 'orange', marker = 'x')
plt.plot(x, table4['Large/Large 3'][:-2], label = "LL3", c = 'orange', marker = 'v')
plt.plot(x, table3['Large/Small 1'][:-2], label = "SL1", c = 'red', marker ='o')
plt.plot(x, table3['Large/Small 2'][:-2], label = 'SL2', c = 'red', marker = 'x')
plt.plot(x, table3['Large/Small 3'][:-2], label = "SL3", c = 'red', marker = 'v')
plt.ylabel('moles')
plt.xlabel('Day')
plt.axvline(x=35, color='black',linestyle='--',label = 'New \u03A9')
plt.legend()
plt.show()
plt.savefig('Turnover_sulphide_box',bbox_inches='tight',pad_inches = 0.1, dpi=500)


##############################################################################

# New plot and calculations for after day 35.

t2 = t[-2:]
OCP2 = OCP[-2:]*(-1)
# The new resistors

R4700 = 4700
R560 = 560
R6800 = 6800

# Carbon

n = 8

# LL1
WP = df.loc[(df['Box'] == 'LL1')]['Pot.'].dropna()*10**-3
WP = WP[-2:]*(-1) # Only take the two last measurements (after day 35)
mLL1 = np.cumsum(WP**2 * t2 / (R4700*n*F*OCP2)) + table2['Large/Large 1'][12]

# LL2
mLL2 = table4['Large/Large 2'][-2:] # did not get the resistor changed

# LL3
WP = df.loc[(df['Box'] == 'LL3')]['Pot.'].dropna()*10**-3
WP = WP[-2:] *(-1) # Only take the two last measurements (after day 35)
mLL3 = np.cumsum(WP**2 * t2 / (R560*n*F*OCP2)) + table2['Large/Large 3'][12]

# SL1
mSL1 = table3['Large/Small 1'][-2:]  # did not get the resistor changed

# SL2
WP = df.loc[(df['Box'] == 'SL1')]['Pot.'].dropna()*10**-3
WP = WP[-2:]*(-1) # Only take the two last measurements (after day 35)
mSL2 = np.cumsum(WP**2 * t2 / (R4700*n*F*OCP2)) + table1['Large/Small 2'][12]

# SL3
WP = df.loc[(df['Box'] == 'SL3')]['Pot.'].dropna()*10**-3
WP = WP[-2:]*(-1) # Only take the two last measurements (after day 35)
mSL3 = np.cumsum(WP**2 * t2 / (R6800*n*F*OCP2))  + table1['Large/Small 3'][12]



# Carbon plot
x = np.unique(df['Day'])[-2:]
plt.plot(x, mLL1, label = "LL1", c = 'orange', marker = 'o')
plt.plot(x, mLL2, label = 'LL2', c = 'orange', marker = 'x')
plt.plot(x, mLL3, label = "LL3", c = 'orange', marker = 'v')
plt.plot(x, mSL1, label = "SL1", c = 'red', marker ='o')
plt.plot(x, mSL2, label = 'SL2', c = 'red', marker = 'x')
plt.plot(x, mSL3, label = "SL3", c = 'red', marker = 'v')
plt.ylabel('moles')
plt.xlabel('Day')
#plt.axvline(x=35, color='black',linestyle='--',label = 'New \u03A9')
plt.legend()
plt.show()
#plt.savefig('Turnover_sulphide_box_after35',bbox_inches='tight',pad_inches = 0.1, dpi=500)




# Sulphide

n = 2

# LL1
WP = df.loc[(df['Box'] == 'LL1')]['Pot.'].dropna()*10**-3
WP = WP[-2:]*(-1) # Only take the two last measurements (after day 35)
m2LL1 = np.cumsum(WP**2 * t2 / (R4700*n*F*OCP2)) + table4['Large/Large 1'][12]

# LL2
m2LL2 = table4['Large/Large 2'][-2:]  # did not get the resistor changed

# LL3
WP = df.loc[(df['Box'] == 'LL3')]['Pot.'].dropna()*10**-3
WP = WP[-2:] *(-1) # Only take the two last measurements (after day 35)
m2LL3 = np.cumsum(WP**2 * t2 / (R560*n*F*OCP2)) + table4['Large/Large 3'][12]

# SL1
m2SL1 = table3['Large/Small 1'][-2:] # did not get the resistor changed

# SL2
WP = df.loc[(df['Box'] == 'SL2')]['Pot.'].dropna()*10**-3
WP = WP[-2:]*(-1) # Only take the two last measurements (after day 35)
m2SL2 = np.cumsum(WP**2 * t2 / (R4700*n*F*OCP2)) + table3['Large/Small 2'][12]

# SL3
WP = df.loc[(df['Box'] == 'SL3')]['Pot.'].dropna()*10**-3
WP = WP[-2:]*(-1) # Only take the two last measurements (after day 35)
m2SL3 = np.cumsum(WP**2 * t2 / (R6800*n*F*OCP2))  + table3['Large/Small 3'][12]

ba35LL1 = np.append(table4['Large/Large 1'][:-2],m2LL1)
ba35LL2 = np.append(table4['Large/Large 2'][:-2],m2LL2)
ba35LL3 = np.append(table4['Large/Large 3'][:-2],m2LL3)

ba35SL1 = np.append(table3['Large/Small 1'][:-2],m2SL1)
ba35SL2 = np.append(table3['Large/Small 2'][:-2],m2SL2)
ba35SL3 = np.append(table3['Large/Small 3'][:-2],m2SL3)


x = np.unique(df['Day'])[1:]
plt.plot(x, ba35LL1, label = "LL1", c = 'orange', marker = 'o')
plt.plot(x, ba35LL2, label = 'LL2', c = 'orange', marker = 'x')
plt.plot(x, ba35LL3, label = "LL3", c = 'orange', marker = 'v')
plt.plot(x, ba35SL1, label = "SL1", c = 'red', marker ='o')
plt.plot(x, ba35SL2, label = 'SL2', c = 'red', marker = 'x')
plt.plot(x, ba35SL3, label = "SL3", c = 'red', marker = 'v')
plt.ylabel('mol')
plt.xlabel('Day')
plt.axvline(x=35, color='black',linestyle='--',label = 'New \u03A9')
plt.legend()
plt.savefig('Turnover_sulphide_box_BA35',bbox_inches='tight',pad_inches = 0.1, dpi=500)
plt.show()



