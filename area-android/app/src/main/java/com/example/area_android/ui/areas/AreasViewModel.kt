package com.example.area_android.ui.areas

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class AreasViewModel : ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "This is <My Areas> Fragment"
    }
    val text: LiveData<String> = _text
}