package com.example.area_android.ui.services

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.example.area_android.AreaApplication
import com.example.area_android.R
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.authentication
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result

class ServicesFragment : Fragment() {

    private lateinit var servicesViewModel: ServicesViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        servicesViewModel =
            ViewModelProviders.of(this).get(ServicesViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_services, container, false)
        val textView: TextView = root.findViewById(R.id.text_services)
        servicesViewModel.text.observe(this, Observer {
            textView.text = it
        })

        val app = this.activity!!.application as AreaApplication
        val username = root.findViewById<TextView>(R.id.username)
        val url = app.serverUrl + "/me"
        Fuel.get(url)
            .authentication()
            .bearer(app.token!!)
            .responseJson { request, response, result ->
                when (result) {
                    is Result.Failure -> {
                        Toast.makeText(this.activity, "Connection to the server failed", Toast.LENGTH_LONG).show()
                    }
                    is Result.Success -> {
                        val obj = result.get().obj()
                        val data = obj.getJSONObject("data")
                        username.text = data.getString("username")
                    }
                }
            }


        return root
    }
}