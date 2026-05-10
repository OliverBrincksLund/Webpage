#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Apr 27 13:58:34 2022

@author: EmmaMoerk
"""
import pandas as pd
import numpy as np

df1 = pd.read_excel ('Data_lab_Individual.xlsx','Reactors')
df2 = pd.read_excel ('Data_lab_Individual.xlsx','Boxes')


##############################################################################
# VALUES FOR REACTORS
##############################################################################


names1 =['C1', 'C2', 'C3', 'CC1', 'CC2', 'CC3', 'S1', 'S2', 'S3', 'RC1', 'RC2',
        'RC3', 'SC1', 'SC2', 'SC3' ]

##############################################################################
#  DO

values_DO = np.empty([1, 3])


for i in range(len(names1)):
    DO = df1.loc[(df1['Reactor'] == names1[i])]['DOcathode'] # Finds places where DO and reactor names fit
    DOmin = np.min(DO) 
    DOmax = np.max(DO)
    DOmean = np.mean(DO)
    valuesdo = np.array([DOmin, DOmax, DOmean]) # Gathers the values in a vector
    valuesdo = valuesdo[np.newaxis, :] # Converts vector to matrix
    values_DO = np.append(values_DO, valuesdo,0) # Gather the matrix in the for-loop to one 
values_DO = np.delete(values_DO, (0), axis=0) # Deletes the firste row as it does not count

##############################################################################
# EC

values_EC = np.empty([1, 3])

for i in range(len(names1)):
    EC = df1.loc[(df1['Reactor'] == names1[i])]['ECcathode']
    ECmin = np.min(EC)
    ECmax = np.max(EC)
    ECmean = np.mean(EC)
    valuesec = np.array([ECmin, ECmax, ECmean])
    valuesec = valuesec[np.newaxis, :]
    values_EC = np.append(values_EC, valuesec,0)
values_EC = np.delete(values_EC, (0), axis=0)


##############################################################################
# Temperatur

values_temp = np.empty([1, 3])

for i in range(len(names1)):
    temp = df1.loc[(df1['Reactor'] == names1[i])]['Temp.']
    tempmin = np.min(temp)
    tempmax = np.max(temp)
    tempmean = np.mean(temp)
    valuestemp = np.array([tempmin, tempmax, tempmean])
    valuestemp = valuestemp[np.newaxis, :]
    values_temp = np.append(values_temp, valuestemp,0)
values_temp = np.delete(values_temp, (0), axis=0)


##############################################################################
#Pot

values_pot = np.empty([1, 3])

for i in range(len(names1)):
    pot = df1.loc[(df1['Reactor'] == names1[i])]['Pot.']
    potmin = np.min(pot)
    potmax = np.max(pot)
    potmean = np.mean(pot)
    valuespot = np.array([potmin, potmax, potmean])
    valuespot = valuespot[np.newaxis, :]
    values_pot = np.append(values_pot, valuespot,0)
values_pot = np.delete(values_pot, (0), axis=0)




##############################################################################
# VALUES FOR BOXES
##############################################################################


names2 =['LL1', 'LL2', 'LL3', 'SL1', 'SL2', 'SL3', 'C-SL1', 'C-SL2', 'C-SL3',
         'CB1', 'CB2','CB3']



##############################################################################
#  DO

values_DOb = np.empty([1, 3])


for i in range(len(names2)):
    DO = df2.loc[(df2['Box'] == names2[i])]['DO'] 
    DOmin = np.min(DO) 
    DOmax = np.max(DO)
    DOmean = np.mean(DO)
    valuesdo = np.array([DOmin, DOmax, DOmean]) 
    valuesdo = valuesdo[np.newaxis, :]
    values_DOb = np.append(values_DOb, valuesdo,0)
values_DOb = np.delete(values_DOb, (0), axis=0) 

##############################################################################
# EC

values_ECb = np.empty([1, 3])

for i in range(len(names2)):
    EC = df2.loc[(df2['Box'] == names2[i])]['EC']
    ECmin = np.min(EC)
    ECmax = np.max(EC)
    ECmean = np.mean(EC)
    valuesec = np.array([ECmin, ECmax, ECmean])
    valuesec = valuesec[np.newaxis, :]
    values_ECb = np.append(values_ECb, valuesec,0)
values_ECb = np.delete(values_ECb, (0), axis=0)


##############################################################################
# Temperatur

values_tempb = np.empty([1, 3])

for i in range(len(names2)):
    temp = df2.loc[(df2['Box'] == names2[i])]['Temp.']
    tempmin = np.min(temp)
    tempmax = np.max(temp)
    tempmean = np.mean(temp)
    valuestemp = np.array([tempmin, tempmax, tempmean])
    valuestemp = valuestemp[np.newaxis, :]
    values_tempb = np.append(values_tempb, valuestemp,0)
values_tempb = np.delete(values_tempb, (0), axis=0)


##############################################################################
#Pot

values_potb = np.empty([1, 3])

for i in range(len(names2)):
    pot = df2.loc[(df2['Box'] == names2[i])]['Pot.']
    potmin = np.min(pot)
    potmax = np.max(pot)
    potmean = np.mean(pot)
    valuespot = np.array([potmin, potmax, potmean])
    valuespot = valuespot[np.newaxis, :]
    values_potb = np.append(values_potb, valuespot,0)
values_potb = np.delete(values_potb, (0), axis=0)



