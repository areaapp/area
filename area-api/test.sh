#!/bin/bash

adonis migration:refresh
adonis seed
adonis test